export interface GithubSearchResponse {
  incomplete_results: boolean;
  total_count: number;
  items: Array<{
    git_url: string;
    html_url: string;
    name: string;
    path: string;
    repository: any;
    score: number;
    sha: string;
    url: string;
  }>;
}

export type DataType = GithubSearchResponse['items'][number];

export interface SearchParams {
  input: string;
  page: number;
  rowsPerPage: number;
}
