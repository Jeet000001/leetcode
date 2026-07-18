import { onBoardUser } from '@/modules/auth/actions'
import { UserButton } from '@clerk/nextjs'

const page = async() => {
  await onBoardUser()
  return (
    <div>
      <UserButton />
      gg
    </div>
  )
}

export default page