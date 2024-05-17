export type TResponse<T> = {
	data: T[];
	count: number;
	offset: number;
	limit: number;
};

export type FormImage = {
  url: string;
  name?: string;
  size?: number;
  nativeFile?: File;
	selected?: boolean;
}