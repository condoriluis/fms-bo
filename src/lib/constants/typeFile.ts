export type UploadFile = {
  id_file: number;
  id_temp?: string;
  name_file: string;
  name_folder_file: string;
  extension_file: string;
  type_file: string;
  size_file: number;
  url_file: string;
  id_mailchimp?: number;
  date_created_file?: Date;
  date_updated_file: Date;

  size_file_display?: string;
  __originalName?: string;
  preview?: string;
  selected?: boolean;
  __originalFile?: File;
};