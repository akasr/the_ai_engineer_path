import { RecursiveCharacterTextSplitter } from 'langchain/text_splitter';
import fs from 'fs/promises';

// Langchain text splitter to split the document into chunks
export async function splitDocument(document) {
  try {
    if (!document || typeof document !== 'string') {
      throw new Error('Document path must be a non-empty string');
    }

    const text = await fs.readFile(document, 'utf-8');

    if (!text || text.trim().length === 0) {
      console.warn('Document is empty or contains only whitespace');
      return [];
    }

    const splitter = new RecursiveCharacterTextSplitter({
      chunkSize: 250,
      chunkOverlap: 10,
    });

    const output = await splitter.createDocuments([text]);

    if (!output || output.length === 0) {
      console.warn('Text splitter returned no chunks');
      return [];
    }

    return output;
  } catch (error) {
    console.error('Error in splitDocument:', error.message);

    // Check if it's a file system error and provide more context
    if (error.code === 'ENOENT') {
      throw new Error(`File not found: ${document}`);
    } else if (error.code === 'EACCES') {
      throw new Error(`Permission denied reading file: ${document}`);
    }

    throw error;
  }
}
