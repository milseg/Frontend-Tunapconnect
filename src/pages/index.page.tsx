import { GetServerSideProps } from 'next'

import { getSession } from 'next-auth/react'

export default function Home() {}

export const getServerSideProps: GetServerSideProps = async (ctx: any) => {
  const session = await getSession(ctx)
  if (session) {
    return {
      redirect: {
        destination: '/company',
        permanent: false,
      },
    }
  } else {
    return {
      redirect: {
        destination: '/auth/login',
        permanent: false,
      },
    }
  }
}
