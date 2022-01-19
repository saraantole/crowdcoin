import Header from './header'
import { Container } from 'semantic-ui-react'
import Image from 'next/image'
import BgImage from '../public/plant.jpg'

export default function Layout({ children }) {
    return (
        <>
            <div className='bgWrap'>
                <Image src={BgImage} layout="fill" objectFit="cover" quality={100} alt='background' objectPosition='top' />
            </div>
            <Container id='container'>
                <Header />
                {children}
            </Container>
        </>

    )
}
