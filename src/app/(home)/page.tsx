import { FilesClient } from "./FilesClient";
import { FileService } from "@/app/api/archivos/FileService";

export const dynamic = 'force-dynamic';

export default async function HomePage() {
  const initialFiles = await FileService.getFiles();
  
  return <FilesClient initialFiles={initialFiles} />;
}
