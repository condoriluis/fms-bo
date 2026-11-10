import { db } from "@/lib/db";
import { getFiles } from "@/lib/file-service";

export class FileService {
    static async getFiles() {
        return getFiles();
    }

    static async getFileById(id_file: number) {
        const numId = Number(id_file);
        const data = await db.file.findUnique({
            where: { id_file: numId }
        });
        if (!data) throw new Error("File not found");
        return {
            ...data,
            id_file: Number(data.id_file),
            size_file: data.size_file !== null ? Number(data.size_file) : null,
            id_mailchimp: data.id_mailchimp !== null ? Number(data.id_mailchimp) : null,
        };
    }

    static async createFile(name_file: string, name_folder_file: string, extension_file: string, type_file: string, size_file: number, url_file: string, id_mailchimp?: number | null) {
        const data = await db.file.create({
            data: {
                name_file,
                name_folder_file,
                extension_file,
                type_file,
                size_file,
                url_file,
                id_mailchimp: id_mailchimp ?? null,
            }
        });
        return { id_file: Number(data.id_file) };
    }

    static async updateFileName(id_file: number, name_file: string) {
        const numId = Number(id_file);
        await db.file.update({
            where: { id_file: numId },
            data: { name_file }
        });
        return 1;
    }

    static async deleteFile(id_file: number) {
        const numId = Number(id_file);
        await db.file.delete({
            where: { id_file: numId }
        });
        return 1;
    }
}
