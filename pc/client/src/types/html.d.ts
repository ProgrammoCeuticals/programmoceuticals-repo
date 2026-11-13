import "react";

declare module "react" {
  interface InputHTMLAttributes<T> {
    webkitdirectory?: string;
  }
}

interface DataTransferItem {
  webkitGetAsEntry?: () => FileSystemEntry | null;
}

interface FileSystemEntry {
  isFile: boolean;
  isDirectory: boolean;
  name: string;
}

interface FileSystemFileEntry extends FileSystemEntry {
  file: (successCallback: (file: File) => void, errorCallback?: () => void) => void;
}

interface FileSystemDirectoryEntry extends FileSystemEntry {
  createReader: () => FileSystemDirectoryReader;
}

interface FileSystemDirectoryReader {
  readEntries: (successCallback: (entries: FileSystemEntry[]) => void, errorCallback?: () => void) => void;
}
