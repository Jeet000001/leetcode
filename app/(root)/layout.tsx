import { currentUserRole } from '@/modules/auth/actions'
import Navbar from '@/modules/home/components/Navbar'


const RootLayout = async({children}) => {
  const userRole = await currentUserRole();
  return (
    <main className='flex flex-col min-h-screen max-h-screen'>
        <Navbar userRole= {userRole} />
        <div>
            {children}
        </div>
    </main>
  )
}

export default RootLayout