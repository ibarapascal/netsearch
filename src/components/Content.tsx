import { GithubSearchResponse } from '@/types';
import { message, Spin } from 'antd';
import React from 'react';
import { useQuery } from 'react-query';

import { ContentTable } from './ContentTable';

export interface ContentProps {
  searchKeyword: string;
}

// could be moved to env files
const ENDPOINT = 'https://api.github.com/search/code';

export function Content({ searchKeyword }: ContentProps): JSX.Element {
  const queryString = encodeURIComponent(`${searchKeyword} user:ibarapascal`);
  const url = `${ENDPOINT}?q=${queryString}`;

  const { isLoading, error, data } = useQuery(
    // the request key
    searchKeyword,
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

  return (
    <>
      {!!searchKeyword && <div>Searching: {searchKeyword}</div>}
      <ContentTable data={data} />
    </>
  );
}
