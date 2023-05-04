import '../styles/globals.css';
import 'bootstrap/dist/css/bootstrap.css';

export const metadata = {
  title: 'Risk Ratings Visualizer',
  description: 'Predictions of Climate Risk Ratings for Businesses in Canada',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className='lg:h-screen w-screen flex flex-col gap-3 bg-gray-100'>
        <h1 className='text-xl font-bold top-0 m-0 p-4 py-2 bg-white shadow'>
          Predictions of Climate Risk Ratings for Businesses in Canada
        </h1>
        {children}
      </body>
    </html>
  )
}
