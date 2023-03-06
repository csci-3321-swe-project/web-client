import type { NextPage } from 'next'
import Head from 'next/head'
import Image from 'next/image'

const Home : NextPage = () => {
    return(
        <div className='center'>
            <Head>
                <title>Tiger Claws</title>
                <link rel="icon" href="/tigerlogo.svg" />
            </Head>
            <main>
                <h1>
                    Tiger Claws!
                </h1>
                <Image alt="icon" src="/tigerlogo.svg" width="100" height="100"/>
                <h2></h2>
                <form action="http://localhost:5000" method="get">
                    <input id='email' placeholder='User Email' type='email'></input>
                    <button>
                        Submit
                    </button>
                </form>
            </main>
        </div>
    )
}

export default Home