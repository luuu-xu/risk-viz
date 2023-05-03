import '../styles/globals.css'

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
      <body className='h-screen w-screen d-flex flex-col bg-gray-100'>
        <h1 className='text-xl font-bold top-0 mb-3 p-4 py-2 bg-white shadow'>
          Predictions of Climate Risk Ratings for Businesses in Canada
        </h1>
        {children}
      </body>
    </html>
  )
}
