import Image from 'next/image'
import Link from 'next/link'
import { Menu } from 'semantic-ui-react'
import Logo from '../public/logo.png'

export default function Header() {
    return (
        <Menu>
            <Link href='/'><a className='item'>
                <Image src={Logo} width={150} height={50} alt='logo'/>
                </a></Link>
            <Menu.Menu position='right'>
            <Link href='/campaigns'><a className='item'>Contribute</a></Link>
            <Link href='/campaigns/new'><a className='item'>Create Campaign</a></Link>
            </Menu.Menu>
        </Menu>
    )
}
