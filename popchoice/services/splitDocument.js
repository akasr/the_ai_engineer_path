import { RecursiveCharacterTextSplitter } from 'langchain/text_splitter';
import fs from 'fs/promises';

// Langchain text splitter to split the document into chunks
export async function splitDocument(document) {
  try {
    const text = await fs.readFile(document, 'utf-8');
    const splitter = new RecursiveCharacterTextSplitter({
      chunkSize: 250,
      chunkOverlap: 10,
    });
    const output = await splitter.createDocuments([text]);
    return output;
  } catch (error) {
    console.error('Error in splitDocument:', error);
    return [];
  }
}
