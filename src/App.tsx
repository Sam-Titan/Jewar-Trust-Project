export default function App() {
  return (
    <main className="flex min-h-svh flex-col items-center justify-center gap-6 px-4">
      <img
        src={`${import.meta.env.BASE_URL}images/wordmark.webp`}
        alt="Jewar"
        width={1692}
        height={410}
        className="w-64 max-w-full sm:w-96"
      />
      <p className="font-heading text-2xl text-green sm:text-4xl">Coming soon</p>
    </main>
  );
}
