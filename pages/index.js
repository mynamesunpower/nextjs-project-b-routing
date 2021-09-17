import { getFeaturedEvents } from "../dummy-data";
import EventList from "../components/events/event-list";
import { useEffect, useState } from "react";
import useSWR from "swr";
import Head from "next/head";
import Link from "next/link";
import NewsletterRegistration from "../components/input/newsletter-registration";

function HomePage(props) {
  const [events, setEvents] = useState(props.featuredEvents);

  const { data, error } = useSWR(
    "https://nextjs-course-d15f9-default-rtdb.firebaseio.com/events.json",
    (url) => fetch(url).then((res) => res.json())
  );

  useEffect(() => {
    if (data) {
      const modifiedData = [];
      for (const key in data) {
        if (data[key].isFeatured) {
          modifiedData.push({
            id: key,
            date: data[key].date,
            description: data[key].description,
            image: data[key].image,
            isFeatured: data[key].isFeatured,
            location: data[key].location,
            title: data[key].title,
          });
        }
      }
      setEvents(modifiedData);
    }
  }, [data]);

  if (error) return <p>Failed to load.</p>;
  if (!data && !events) return <p>Loading...</p>;

  return (
    <div>
      <Head>
        <title>Hello!</title>
      </Head>
      <Head>
        {/* 최근 것만 취급함! */}
        <title>Next.js Events</title>
        <meta
          name="description"
          content="find a lot of great events that allow you to evolve..."
        />
      </Head>
      <NewsletterRegistration />
      <EventList items={events} />
    </div>
  );
}

export default HomePage;

export async function getStaticProps() {
  const featuredEvents = await getFeaturedEvents();
  return {
    props: {
      featuredEvents,
    },
    revalidate: 1800, // 1 hour
  };
}
