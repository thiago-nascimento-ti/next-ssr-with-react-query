import Head from 'next/head'
import { QueryClient, useQuery } from 'react-query'
import { dehydrate } from 'react-query/hydration'
import fetch from 'node-fetch';

export default function Home() {
  const { 
    data: users, 
    isFetching, 
    dataUpdatedAt, 
    isFetchedAfterMount, 
    refetch 
  } = useQuery('users', () => getDelayedData(getUsers), { 
    refetchOnMount: false,
    retry: false
  });

  return (
    <div>
      <Head>
        <title>Next SSR with React Query</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        {isFetching && <h1>loading...</h1>}
        {users.length === 0 && !isFetching && <h1>Empty</h1>}
        {!isFetching && users?.map(({ name }) => (
          <h2 key={name}>{name}</h2>
        ))}
        <button onClick={() => refetch()}>Reload</button>

        <p>Data fetched on {isFetchedAfterMount ? "client side" : "server side"}</p>
        <p>Last data fetched time {new Date(dataUpdatedAt).toJSON()}</p>
      </main>
    </div>
  )
}

const getUsers = (query) => 
  fetch('api/graphql', {
    method: 'POST',
    headers: {
      'Content-type': 'application/json',
    },
    body: JSON.stringify({ query }),
  })
    .then((res) => res.json())
    .then(({ data: { users } }) => users);

const getDelayedData = (fetcher) => {
  if (typeof window === 'undefined') return Promise.resolve([]);

  return new Promise((resolve) => {
    setTimeout(async () => {
      const data = await fetcher("{ users { name } }")
      resolve(data);
    }, typeof window === 'undefined' ? 0 : 1500)
  })
}

export async function getServerSideProps() {
  const queryClient = new QueryClient()
  await queryClient.prefetchQuery('users', () => getDelayedData(getUsers))

  return { props: { dehydratedState: dehydrate(queryClient) } }
}
