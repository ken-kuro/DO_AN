import logging
import json
from revChatGPT.V1 import Chatbot
import tiktoken

from modules.utils import parse_uploaded_file
from .prompts import json_resume_prompts


# official
# from revChatGPT.V3 import Chatbot


class ResumeParser():
    def __init__(self, KEY):
        self.parser = Chatbot(config={
            "access_token": KEY
        })
        self.encoding = tiktoken

        # set up this parser's logger
        logging.basicConfig(filename='logs/parser.log', level=logging.DEBUG)
        self.logger = logging.getLogger()

    # TODO: Fix this
    # https://github.com/openai/openai-cookbook/blob/main/examples/How_to_count_tokens_with_tiktoken.ipynb

    def query_completion(self: object,
                         prompt: str,
                         engine: str = 'gpt-3.5-turbo',
                         temperature: float = 0.0,
                         max_tokens: int = 100,
                         top_p: int = 1,
                         frequency_penalty: int = 0,
                         presence_penalty: int = 0) -> object:
        self.logger.info(f'query_completion: using {engine}')
        encoding = self.encoding.encoding_for_model(engine)

        # self.logger.info(f'estimated prompt tokens: {estimated_prompt_tokens}')
        # estimated_answer_tokens = 2049 - estimated_prompt_tokens
        # if estimated_answer_tokens < max_tokens:
        #     self.logger.warning('estimated_answer_tokens lower than max_tokens, changing max_tokens to',
        #                         estimated_answer_tokens)
        response = ""
        for data in self.parser.ask(prompt):
            response = data["message"]

        return response

    def query_resume(self: object, file_path: str) -> dict:
        """
        Query GPT-3 for the work experience and / or basic information from the resume at the PDF file path.
        :param file_path: Path to the PDF file.
        :return dictionary of resume with keys (basic_info, work_experience).
        """
        resume_lines, raw_text = parse_uploaded_file(file_path)
        resume = {}
        for field, prompt in json_resume_prompts.items():
            prompt = prompt + '\n' + raw_text
            max_tokens = 1500
            engine = 'gpt-3.5-turbo'
            response = self.query_completion(prompt, engine=engine, max_tokens=max_tokens)
            try:
                json_response = json.loads(response)
            except ValueError:
                json_response = None

            if isinstance(json_response, dict) and field in json_response:
                resume[field] = json_response[field]
            else:
                resume[field] = json_response

        return resume
