import { DataType, GithubSearchResponse, SearchParams } from '@/types';
import { query } from '@/utils';
import { message, Pagination, Spin, Table } from 'antd';
import { ColumnsType } from 'antd/es/table';
import classnames from 'classnames';
import React, { HTMLAttributes } from 'react';
import { useQuery } from 'react-query';

import classes from './Content.module.scss';

enum TableColumn {
  NAME = 'name',
  PATH = 'path',
  URL = 'url',
}
const columns: ColumnsType<DataType> = [
  { title: 'Name', dataIndex: TableColumn.NAME },
  { title: 'Path', dataIndex: TableColumn.PATH },
  { title: 'URL', dataIndex: TableColumn.URL },
].map((item) => ({
  ...item,
  key: item.dataIndex,
}));

export interface ContentProps extends HTMLAttributes<HTMLDivElement> {
  params: SearchParams;
  onChangePagination: (currentPage: number, pageSize?: number) => void;
}

// could be moved to env files
const ENDPOINT = 'https://api.github.com/search/code';

export function Content({
  params: { input: searchKeyword, page, rowsPerPage },
  onChangePagination,
  className,
  ...props
}: ContentProps): JSX.Element {
  const params = {
    q: `${searchKeyword} user:ibarapascal`,
    page: page.toString(),
    per_page: rowsPerPage.toString(),
  };
  const url = `${ENDPOINT}${query(params)}`;

  const { isLoading, error, data } = useQuery(
    // the request dependencies
    [searchKeyword, page, rowsPerPage],
    (): Promise<GithubSearchResponse> =>
      fetch(url).then((res) => {
        message.success('Fetched!', 1);
        return res.json();
      }),
    // TODO: error handling, error boundary
    {
      // init without request
      enabled: !!searchKeyword,
      // handle the cache existing time
      // notice that react-query would fetch on switching the tab back as well,
      // to prevent the escape of throttle, set it above the rate limitation.
      staleTime: 6000,
    },
  );
  if (isLoading) return <Spin />;
  if (error) return <div>An error has occurred</div>;

  const totalAmount = data?.total_count ?? 0;
  const tableData =
    data?.items.map((item) => ({
      ...item,
      key: item.sha,
      id: item.sha,
    })) ?? [];

  return (
    <div {...props} className={classnames(classes.Content, className)}>
      {!!searchKeyword && (
        <>
          <div className={classes.ContentTips}>
            <div>Searching: {searchKeyword}</div>
            <div>Page: {page}</div>
            <div>Page Size: {rowsPerPage}</div>
          </div>
          <Pagination
            current={page}
            defaultCurrent={1}
            pageSize={rowsPerPage}
            pageSizeOptions={[5, 10, 20, 50, 100]}
            showSizeChanger
            total={totalAmount}
            onChange={onChangePagination}
          />
        </>
      )}
      <Table columns={columns} dataSource={tableData} pagination={false} />
    </div>
  );
}
