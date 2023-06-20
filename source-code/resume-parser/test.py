import fitz

doc = fitz.open('[Full Stack Developer] Hoang Pham.pdf')

text = ""
for page in doc:
    text += page.get_text()
print(text)
doc.close()
