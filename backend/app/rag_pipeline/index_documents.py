# rag-pipeline/index_documents.py

import os
import glob
from langchain.document_loaders import TextLoader
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain.embeddings import OpenAIEmbeddings
from langchain.vectorstores import FAISS
from langchain.docstore.document import Document
from dotenv import load_dotenv

load_dotenv()

def load_glossary_files(path="data/glossary"):
    # Supports .md, .txt, .json (simple text inside)
    files = glob.glob(os.path.join(path, "*.*"))
    documents = []
    for file in files:
        ext = os.path.splitext(file)[1].lower()
        if ext in [".md", ".txt"]:
            loader = TextLoader(file, encoding="utf8")
            docs = loader.load()
            documents.extend(docs)
        elif ext == ".json":
            import json
            with open(file, "r", encoding="utf8") as f:
                data = json.load(f)
                # If JSON is a dict with "text" fields or list of texts:
                if isinstance(data, dict):
                    text = " ".join(str(v) for v in data.values())
                    documents.append(Document(page_content=text))
                elif isinstance(data, list):
                    for entry in data:
                        if isinstance(entry, dict):
                            text = " ".join(str(v) for v in entry.values())
                            documents.append(Document(page_content=text))
                        else:
                            documents.append(Document(page_content=str(entry)))
        else:
            print(f"Skipping unsupported file type: {file}")
    return documents

def main():
    print("Loading glossary files...")
    docs = load_glossary_files()

    print(f"Loaded {len(docs)} documents. Splitting into chunks...")
    splitter = RecursiveCharacterTextSplitter(chunk_size=300, chunk_overlap=50)
    chunks = splitter.split_documents(docs)
    print(f"Split into {len(chunks)} chunks.")

    print("Generating embeddings...")
    embeddings = OpenAIEmbeddings()

    print("Creating FAISS index...")
    vectorstore = FAISS.from_documents(chunks, embeddings)

    save_path = "rag-pipeline/vector_store.faiss"
    print(f"Saving FAISS index to {save_path} ...")
    vectorstore.save_local(save_path)

    print("Indexing complete!")

if __name__ == "__main__":
    main()
