# https://jsonresume.org/schema/
json_resume_prompts = {
    'basics':
        'Convert the text below to JSON Resume format. Return basics field only which is { name, label, image, email, '
        'phone, url, summary, location: { address, postalCode,  city, countryCode, region }, profiles: [{network, '
        'username, url}]',
    'work':
        'Convert the text below to JSON Resume format. Return work field only which is [{ name, position, url, '
        'startDate, endDate, summary, highlights: []}]',
    'volunteers':
        'Convert the text below to JSON Resume format. Return volunteer field only which is [{ organization, '
        'position, url, startDate, endDate, summary, highlights: []}]',
    'education':
        'Convert the text below to JSON Resume format. Return education field only which is [{ institution, url, '
        'area, studyType, startDate, endDate, score, courses: []}]',
    'awards':
        'Convert the text below to JSON Resume format. Return awards field only which is [{ title, date, awarder, '
        'summary}]',
    'certificates':
        'Convert the text below to JSON Resume format. Return certificates field only which is [{ name, date, issuer, '
        'url}]',
    'publications':
        'Convert the text below to JSON Resume format. Return publications field only which is [{ name, publisher, '
        'releaseDate, url, summary}]',
    'skills':
        'Convert the text below to JSON Resume format. Return skills field only which is [{ name, level, keywords: ['
        ']}]',
    'languages':
        'Convert the text below to JSON Resume format. Return languages field only which is [{ language, fluency}]',
    'interests':
        'Convert the text below to JSON Resume format. Return interests field only which is [{ name, keywords: []}]',
    'references':
        'Convert the text below to JSON Resume format. Return references field only which is [{ name, reference }]',
    'projects':
        'Convert the text below to JSON Resume format. Return references field only which is [{ name, description, '
        'highlights: [], keywords: [], startDate, endDate, url, roles: [], entity, type }] '
}
