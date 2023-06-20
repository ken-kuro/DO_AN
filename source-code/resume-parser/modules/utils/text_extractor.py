import os
import re
from typing import Tuple, List

import fitz
from fitz import Rect, Page, Matrix
import docx
import logging


# https://github.com/pymupdf/PyMuPDF-Utilities/blob/master/OCR/tesseract2.py
def extract_text_from_pdf(filepath):
    """ :return: str """
    print(f"PDF: {filepath}")

    def get_tessocr(page: Page, bbox: Rect, mat: Matrix):
        # Step 1: Make a high-resolution image of the bbox.
        pix = page.get_pixmap(
            matrix=mat,
            clip=bbox,
        )
        ocrpdf = fitz.open("pdf", pix.pdfocr_tobytes(language="eng+vie"))
        ocrpage = ocrpdf[0]
        text = ocrpage.get_text()
        if text.endswith("\n"):
            text = text[:-1]
        print(f'OCR each text: {text}')
        return text

    doc = fitz.open(filepath)
    mat = fitz.Matrix(5, 5)  # high resolution matrix
    text = ""
    for page in doc:
        blocks = page.get_text("dict", flags=0, sort=True)["blocks"]
        if blocks:
            for b in blocks:
                for l in b["lines"]:
                    for s in l["spans"]:
                        current_text = s["text"]
                        # disabled to increase speed
                        if chr(65533) in text:  # invalid characters encountered!
                            # invoke OCR
                            spaces = current_text.lstrip()
                            sb = " " * (len(current_text) - len(spaces))  # leading spaces
                            spaces = current_text.rstrip()
                            sa = " " * (len(current_text) - len(spaces))  # trailing spaces
                            current_text = sb + get_tessocr(page, s["bbox"], mat) + sa
                        text += current_text
                text += '\n'
        else:
            print('OCR')
            pix = page.get_pixmap(
                matrix=mat,
            )
            ocrpdf = fitz.open("pdf", pix.pdfocr_tobytes(language="eng+vie"))
            ocrpage = ocrpdf[0]
            text = ocrpage.get_text()
    return text


def extract_text_from_docx(file_path):
    """ :return: str """
    print(f"DOCX:{file_path}")
    doc = docx.Document(file_path)

    text = []
    for para in doc.paragraphs:
        text.append(para.text)

    return '\n'.join(text)


def parse_uploaded_file(file_path: str) -> Tuple[List[str], str]:
    file_extension = os.path.splitext(file_path)[1].lower()
    clean_text = ""
    line_content = []

    if file_extension == '.pdf':
        try:
            raw_content = extract_text_from_pdf(file_path)

            clean_text = re.sub(r'\n+', '\n', raw_content)
            clean_text = clean_text.replace("\r", "\n")
            clean_text = clean_text.replace("\t", " ")
            # Remove awkward LaTeX bullet characters
            clean_text = re.sub(r"\uf0b7", " ", clean_text)
            clean_text = re.sub(r"\(cid:\d{0,2}\)", " ", clean_text)
            clean_text = re.sub(r'• ', " ", clean_text)
            # Split text blob into individual lines
            line_content = clean_text.splitlines(True)
            # Remove empty strings and whitespaces
            line_content = [re.sub('\s+', ' ', line.strip()) for line in line_content if line.strip()]
        except Exception as e:
            logging.error('Error in pdf file:: ' + str(e))

    elif file_extension == '.docx':
        try:
            raw_content = extract_text_from_docx(file_path)

            clean_text = re.sub(r'\n+', '\n', raw_content)
            clean_text = clean_text.replace("\r", "\n").replace("\t", " ")  # Normalize text blob
            line_content = clean_text.splitlines()  # Split text blob into individual lines
            line_content = [re.sub('\s+', ' ', line.strip()) for line in line_content if
                            line.strip()]  # Remove empty strings and whitespaces

        except Exception as e:
            logging.error('Error in docx file:: ' + str(e))

    return line_content, clean_text
