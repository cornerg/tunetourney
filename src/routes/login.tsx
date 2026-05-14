import {createFileRoute} from '@tanstack/react-router';

function Login() {
  return (
    <div className="row gap-0">
      <div className="column min-w-[50vw] min-h-[100vh] p-4 justify-center">
        <p className="text-center">Content Left</p>
      </div>

      <div className="column min-w-[50vw] min-h-[100vh] p-4 justify-center items-center">
        <p className="text-center">Content Right</p>
      </div>
    </div>
  )
}

export const Route = createFileRoute('/login')({
  component: Login,
})
