import { GithubSearchResponse } from '@/types';
import { Table } from 'antd';
import { ColumnsType } from 'antd/es/table';
import React, { HTMLAttributes, useState } from 'react';

type DataType = GithubSearchResponse['items'][number];

enum TableColumn {
  NAME = 'name',
  PATH = 'path',
  URL = 'url',
}
const tableColumns = [
  { title: 'Name', dataIndex: TableColumn.NAME },
  { title: 'Path', dataIndex: TableColumn.PATH },
  { title: 'URL', dataIndex: TableColumn.URL },
];
const columns: ColumnsType<DataType> = tableColumns.map((item) => ({
  ...item,
  key: item.dataIndex,
}));

export interface ContentTableProps extends HTMLAttributes<HTMLDivElement> {
  data?: GithubSearchResponse;
}

const DEFAULT_ROWS_PER_PAGE = 5;

export function ContentTable({ data }: ContentTableProps): JSX.Element {
  const [page, setPage] = useState<number>(1);
  const [rowsPerPage, setRowsPerPage] = useState<number>(DEFAULT_ROWS_PER_PAGE);

  const handleChangePagination = (
    currentPage: number,
    pageSize?: number,
  ): void => {
    setPage(currentPage);
    !!pageSize && setRowsPerPage(pageSize);
  };

  const totalAmount = data?.total_count ?? 0;
  const tableData =
    data?.items.map((item) => ({
      ...item,
      key: item.sha,
      id: item.sha,
    })) ?? [];

  return (
    <Table
      columns={columns}
      dataSource={tableData}
      pagination={{
        current: page,
        onChange: handleChangePagination,
        defaultCurrent: 1,
        position: ['topRight', 'bottomRight'],
        pageSize: rowsPerPage,
        showQuickJumper: true,
        showSizeChanger: true,
        pageSizeOptions: [5, 10, 20, 50, 100],
        total: totalAmount,
      }}
    />
  );
}
