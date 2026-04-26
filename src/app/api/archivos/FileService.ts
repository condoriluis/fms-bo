import { prisma } from "@/lib/prisma";

export class FileService {
    static async getFiles() {
        const data = await prisma.file.findMany({
            orderBy: { date_created_file: "desc" }
        });
        return data;
    }

    static async getFileById(id_file: number) {
        const data = await prisma.file.findUnique({
            where: { id_file }
        });
        if (!data) throw new Error("File not found");
        return data;
    }

    static async createFile(name_file: string, name_folder_file: string, extension_file: string, type_file: string, size_file: number, url_file: string, id_mailchimp?: number) {
        const data = await prisma.file.create({
            data: {
                name_file,
                name_folder_file,
                extension_file,
                type_file,
                size_file,
                url_file,
                id_mailchimp,
            }
        });
        return { id_file: data.id_file };
    }

    static async updateFileName(id_file: number, name_file: string) {
        await prisma.file.update({
            where: { id_file },
            data: { name_file }
        });
        return 1;
    }

    static async deleteFile(id_file: number) {
        await prisma.file.delete({
            where: { id_file }
        });
        return 1;
    }
}
