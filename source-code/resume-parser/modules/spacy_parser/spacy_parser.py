from __future__ import division
import re
import os
from datetime import date
import pandas as pd
import phonenumbers
import logging
import spacy
from spacy.matcher import Matcher
from spacy.matcher import PhraseMatcher
from .labels import objective, work_and_employment, education_and_training, skills_header, misc, accomplishments
from modules.utils import parse_uploaded_file

# load pre-trained model
base_path = os.path.dirname(__file__)

nlp = spacy.load('en_core_web_sm')
custom_nlp2 = spacy.load(os.path.join(base_path, "pre_trained_models", "degree", "model"))
custom_nlp3 = spacy.load(os.path.join(base_path, "pre_trained_models", "company_working", "model"))

# initialize matcher with a vocab
matcher = Matcher(nlp.vocab)

# https://spacy.io/usage/v2#migrating-matcher
file = os.path.join(base_path, "termilogy_list", "job-titles.txt")
file = open(file, "r", encoding='utf-8')
job_titles = [line.strip().lower() for line in file]
job_title_matcher = PhraseMatcher(vocab=nlp.vocab)
patterns = [nlp.make_doc(text) for text in job_titles if len(nlp.make_doc(text)) < 10]
job_title_matcher.add("Job title", None, *patterns)

file = os.path.join(base_path, "termilogy_list", "linkedin-skills.txt")
file = open(file, "r", encoding='utf-8')
skills = [line.strip().lower() for line in file]
skill_matcher = PhraseMatcher(nlp.vocab)
patterns = [nlp.make_doc(text) for text in skills if len(nlp.make_doc(text)) < 10]
skill_matcher.add("Skill", None, *patterns)


def find_segment_indices(string_to_search, resume_segments, resume_indices):
    for i, line in enumerate(string_to_search):

        if line[0].islower():
            continue

        header = line.lower()

        if [o for o in objective if header.startswith(o)]:
            try:
                resume_segments['objective'][header]
            except:
                resume_indices.append(i)
                header = [o for o in objective if header.startswith(o)][0]
                resume_segments['objective'][header] = i
        elif [w for w in work_and_employment if header.startswith(w)]:
            try:
                resume_segments['work_and_employment'][header]
            except:
                resume_indices.append(i)
                header = [w for w in work_and_employment if header.startswith(w)][0]
                resume_segments['work_and_employment'][header] = i
        elif [e for e in education_and_training if header.startswith(e)]:
            try:
                resume_segments['education_and_training'][header]
            except:
                resume_indices.append(i)
                header = [e for e in education_and_training if header.startswith(e)][0]
                resume_segments['education_and_training'][header] = i
        elif [s for s in skills_header if header.startswith(s)]:
            try:
                resume_segments['skills'][header]
            except:
                resume_indices.append(i)
                header = [s for s in skills_header if header.startswith(s)][0]
                resume_segments['skills'][header] = i
        elif [m for m in misc if header.startswith(m)]:
            try:
                resume_segments['misc'][header]
            except:
                resume_indices.append(i)
                header = [m for m in misc if header.startswith(m)][0]
                resume_segments['misc'][header] = i
        elif [a for a in accomplishments if header.startswith(a)]:
            try:
                resume_segments['accomplishments'][header]
            except:
                resume_indices.append(i)
                header = [a for a in accomplishments if header.startswith(a)][0]
                resume_segments['accomplishments'][header] = i


def slice_segments(string_to_search, resume_segments, resume_indices):
    resume_segments['contact_info'] = string_to_search[:resume_indices[0]]

    for section, value in resume_segments.items():
        if section == 'contact_info':
            continue

        for sub_section, start_idx in value.items():
            end_idx = len(string_to_search)
            if (resume_indices.index(start_idx) + 1) != len(resume_indices):
                end_idx = resume_indices[resume_indices.index(start_idx) + 1]

            resume_segments[section][sub_section] = string_to_search[start_idx:end_idx]


def segment(string_to_search):
    resume_segments = {
        'objective': {},
        'work_and_employment': {},
        'education_and_training': {},
        'skills': {},
        'accomplishments': {},
        'misc': {}
    }

    resume_indices = []

    find_segment_indices(string_to_search, resume_segments, resume_indices)
    if len(resume_indices) != 0:
        slice_segments(string_to_search, resume_segments, resume_indices)
    else:
        resume_segments['contact_info'] = []

    return resume_segments


def calculate_experience(resume_text):
    def correct_year(result):
        if len(result) < 2:
            if int(result) > int(str(date.today().year)[-2:]):
                result = str(int(str(date.today().year)[:-2]) - 1) + result
            else:
                result = str(date.today().year)[:-2] + result
        return result

    # try:
    experience = 0
    start_month = -1
    start_year = -1
    end_month = -1
    end_year = -1

    not_alpha_numeric = r'[^a-zA-Z\d]'
    number = r'(\d{2})'

    months_num = r'(01)|(02)|(03)|(04)|(05)|(06)|(07)|(08)|(09)|(10)|(11)|(12)'
    months_short = r'(jan)|(feb)|(mar)|(apr)|(may)|(jun)|(jul)|(aug)|(sep)|(oct)|(nov)|(dec)'
    months_long = r'(january)|(february)|(march)|(april)|(may)|(june)|(july)|(august)|(september)|(october)|(' \
                  r'november)|(december)'
    month = r'(' + months_num + r'|' + months_short + r'|' + months_long + r')'
    regex_year = r'((20|19)(\d{2})|(\d{2}))'
    year = regex_year
    start_date = month + not_alpha_numeric + r"?" + year

    # end_date = r'((' + number + r'?' + not_alpha_numeric + r"?" + number + not_alpha_numeric + r"?" + year +
    # r')|(present|current))'
    end_date = r'((' + number + r'?' + not_alpha_numeric + r"?" + month + not_alpha_numeric + r"?" + year + r')|(present|current|till date|today))'
    longer_year = r"((20|19)(\d{2}))"
    year_range = longer_year + r"(" + not_alpha_numeric + r"{1,4}|(\s*to\s*))" + r'(' + longer_year + r'|(present|current|till date|today))'
    date_range = r"(" + start_date + r"(" + not_alpha_numeric + r"{1,4}|(\s*to\s*))" + end_date + r")|(" + year_range + r")"

    regular_expression = re.compile(date_range, re.IGNORECASE)

    regex_result = re.search(regular_expression, resume_text)

    while regex_result:
        try:
            date_range = regex_result.group()
            # print(date_range)
            # print("*"*100)
            try:

                year_range_find = re.compile(year_range, re.IGNORECASE)
                year_range_find = re.search(year_range_find, date_range)
                # print("year_range_find",year_range_find.group())

                # replace = re.compile(r"(" + not_alpha_numeric + r"{1,4}|(\s*to\s*))", re.IGNORECASE)
                replace = re.compile(r"((\s*to\s*)|" + not_alpha_numeric + r"{1,4})", re.IGNORECASE)
                replace = re.search(replace, year_range_find.group().strip())
                # print(replace.group())
                # print(year_range_find.group().strip().split(replace.group()))
                start_year_result, end_year_result = year_range_find.group().strip().split(replace.group())
                # print(start_year_result, end_year_result)
                # print("*"*100)
                start_year_result = int(correct_year(start_year_result))
                if (end_year_result.lower().find('present') != -1 or
                        end_year_result.lower().find('current') != -1 or
                        end_year_result.lower().find('till date') != -1 or
                        end_year_result.lower().find('today') != -1):
                    end_month = date.today().month  # current month
                    end_year_result = date.today().year  # current year
                else:
                    end_year_result = int(correct_year(end_year_result))


            except Exception as e:
                # logging.error(str(e))
                start_date_find = re.compile(start_date, re.IGNORECASE)
                start_date_find = re.search(start_date_find, date_range)

                non_alpha = re.compile(not_alpha_numeric, re.IGNORECASE)
                non_alpha_find = re.search(non_alpha, start_date_find.group().strip())

                replace = re.compile(start_date + r"(" + not_alpha_numeric + r"{1,4}|(\s*to\s*))", re.IGNORECASE)
                replace = re.search(replace, date_range)
                date_range = date_range[replace.end():]

                start_year_result = start_date_find.group().strip().split(non_alpha_find.group())[-1]

                # if len(start_year_result)<2:
                #   if int(start_year_result) > int(str(date.today().year)[-2:]):
                #     start_year_result = str(int(str(date.today().year)[:-2]) - 1 )+start_year_result
                #   else:
                #     start_year_result = str(date.today().year)[:-2]+start_year_result
                # start_year_result = int(start_year_result)
                start_year_result = int(correct_year(start_year_result))

                if date_range.lower().find('present') != -1 or date_range.lower().find('current') != -1:
                    end_month = date.today().month  # current month
                    end_year_result = date.today().year  # current year
                else:
                    end_date_find = re.compile(end_date, re.IGNORECASE)
                    end_date_find = re.search(end_date_find, date_range)

                    end_year_result = end_date_find.group().strip().split(non_alpha_find.group())[-1]

                    # if len(end_year_result)<2:
                    #   if int(end_year_result) > int(str(date.today().year)[-2:]):
                    #     end_year_result = str(int(str(date.today().year)[:-2]) - 1 )+end_year_result
                    #   else:
                    #     end_year_result = str(date.today().year)[:-2]+end_year_result
                    # end_year_result = int(end_year_result)
                    try:
                        end_year_result = int(correct_year(end_year_result))
                    except Exception as e:
                        logging.error(str(e))
                        end_year_result = int(re.search("\d+", correct_year(end_year_result)).group())

            if (start_year == -1) or (start_year_result <= start_year):
                start_year = start_year_result
            if (end_year == -1) or (end_year_result >= end_year):
                end_year = end_year_result

            resume_text = resume_text[regex_result.end():].strip()
            regex_result = re.search(regular_expression, resume_text)
        except Exception as e:
            logging.error(str(e))
            resume_text = resume_text[regex_result.end():].strip()
            regex_result = re.search(regular_expression, resume_text)

    return end_year - start_year  # Use the obtained month attribute


# except Exception as exception_instance:
#   logging.error('Issue calculating experience: '+str(exception_instance))
#   return None

def get_experience(resume_segments):
    total_exp = 0
    if len(resume_segments['work_and_employment'].keys()):
        text = ""
        for key, values in resume_segments['work_and_employment'].items():
            text += " ".join(values) + " "
        total_exp = calculate_experience(text)
        return total_exp, text
    else:
        text = ""
        for key in resume_segments.keys():
            if key != 'education_and_training':
                if key == 'contact_info':
                    text += " ".join(resume_segments[key]) + " "
                else:
                    for key_inner, value in resume_segments[key].items():
                        text += " ".join(value) + " "
        total_exp = calculate_experience(text)
        return total_exp, text
    return total_exp, " "


def find_phone(text):
    try:
        return list(iter(phonenumbers.PhoneNumberMatcher(text, None)))[0].raw_string
    except:
        try:
            return re.search(
                r'(\d{3}[-\.\s]??\d{3}[-\.\s]??\d{4}|\(\d{3}\)\s*\d{3}[-\.\s]??\d{4}|\d{3}[-\.\s]??\d{4})',
                text).group()
        except:
            return ""


def extract_email(text):
    email = re.findall(r"([^@|\s]+@[^@]+\.[^@|\s]+)", text)
    if email:
        try:
            return email[0].split()[0].strip(';')
        except IndexError:
            return None


def extract_name(resume_text):
    nlp_text = nlp(resume_text)

    # First name and Last name are always Proper Nouns
    # pattern_FML = [{'POS': 'PROPN', 'ENT_TYPE': 'PERSON', 'OP': '+'}]

    pattern = [{'POS': 'PROPN'}, {'POS': 'PROPN'}]
    matcher.add('NAME', None, pattern)

    matches = matcher(nlp_text)

    for match_id, start, end in matches:
        span = nlp_text[start:end]
        return span.text
    return ""


def extract_university(text, file):
    df = pd.read_csv(file, header=None)
    universities = [i.lower() for i in df[1]]
    college_name = []
    listex = universities
    listsearch = [text.lower()]

    for i in range(len(listex)):
        for ii in range(len(listsearch)):

            if re.findall(listex[i], re.sub(' +', ' ', listsearch[ii])):
                college_name.append(listex[i])

    return college_name


def extract_job_title(text):
    job_titles = []

    __nlp = nlp(text.lower())

    matches = job_title_matcher(__nlp)
    for match_id, start, end in matches:
        span = __nlp[start:end]
        job_titles.append(span.text)
    return job_titles


def extract_degree(text):
    doc = custom_nlp2(text)
    degree = []

    degree = [ent.text.replace("\n", " ") for ent in list(doc.ents) if ent.label_ == 'Degree']
    return list(dict.fromkeys(degree).keys())


def extract_company(text):
    doc = custom_nlp3(text)
    degree = []

    degree = [ent.text.replace("\n", " ") for ent in list(doc.ents)]
    return list(dict.fromkeys(degree).keys())


def extract_skills(text):
    skills = []

    __nlp = nlp(text.lower())
    # Only run nlp.make_doc to speed things up

    matches = skill_matcher(__nlp)
    for match_id, start, end in matches:
        span = __nlp[start:end]
        skills.append(span.text)
    skills = list(set(skills))
    return skills


def process_file(file_path):
    resume_lines, raw_text = parse_uploaded_file(file_path)
    print(f"resume_lines: {resume_lines}")
    print(f"raw_text: {raw_text}")
    resume_segments = segment(resume_lines)
    print(f"segments: {resume_segments}")
    full_text = " ".join(resume_lines)
    email = extract_email(full_text)
    phone = find_phone(full_text)
    name = extract_name(" ".join(resume_segments['contact_info']))
    total_exp, text = get_experience(resume_segments)
    university = extract_university(full_text, os.path.join(base_path, 'world-universities.csv'))

    job_title = extract_job_title(full_text)
    job_title = list(dict.fromkeys(job_title).keys())

    degree = extract_degree(full_text)
    company_working = extract_company(full_text)

    skills = ""

    if len(resume_segments['skills'].keys()):
        for key, values in resume_segments['skills'].items():
            skills += re.sub(key, '', ",".join(values), flags=re.IGNORECASE)
        skills = skills.strip().strip(",").split(",")

    if len(skills) == 0:
        skills = extract_skills(full_text)
    skills = list(dict.fromkeys(skills).keys())

    return {
        "email": email,
        "phone": phone,
        "name": name,
        "total_exp": total_exp,
        "education": university,
        "job_title": job_title,
        "degree": degree,
        "skills": skills,
        "work_experiences": company_working
    }
