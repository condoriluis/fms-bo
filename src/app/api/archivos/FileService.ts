import { supabaseServer } from "@/lib/supabase/server";

export class FileService {
    static async getFiles() {
        const supabase = await supabaseServer();
        const { data, error } = await supabase.from("files").select("*").order("date_created_file", { ascending: false });
        if (error) throw new Error(error.message);
        return data;
    }

    static async getFileById(id_file: number) {
        const supabase = await supabaseServer();
        const { data, error } = await supabase.from("files").select("*").eq("id_file", id_file).single();
        if (error) throw new Error(error.message);
        return data;
    }

    static async createFile(name_file: string, name_folder_file: string, extension_file: string, type_file: string, size_file: number, url_file: string, id_mailchimp?: number) {
        const supabase = await supabaseServer();
        const { data, error } = await supabase.from("files").insert([{
            name_file, name_folder_file,
            extension_file, type_file,
            size_file,
            url_file,
            id_mailchimp,
            date_updated_file: new Date()
        }]).select().single();
        if (error) throw new Error(error.message);
        return { id_file: data.id_file };
    }

    static async updateFileName(id_file: number, name_file: string) {
        const supabase = await supabaseServer();
        const { error } = await supabase.from("files").update({
            name_file,
            date_updated_file: new Date()
        }).eq("id_file", id_file);
        if (error) throw new Error(error.message);
        return 1;
    }

    static async deleteFile(id_file: number) {
        const supabase = await supabaseServer();
        const { error } = await supabase.from("files").delete().eq("id_file", id_file);
        if (error) throw new Error(error.message);
        return 1;
    }
}
