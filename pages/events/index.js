import { Fragment, useEffect, useState } from "react";
import { useRouter } from "next/router";

import { getAllEvents } from "../../dummy-data";
import EventList from "../../components/events/event-list";
import EventsSearch from "../../components/events/events-search";
import useSWR from "swr";

function AllEventsPage(props) {
  const router = useRouter();
  const [events, setEvents] = useState(props.allEvents);

  const { data, error } = useSWR(
    "https://nextjs-course-d15f9-default-rtdb.firebaseio.com/events.json",
    (url) => fetch(url).then((res) => res.json())
  );

  useEffect(() => {
    if (data) {
      const modifiedData = [];
      for (const key in data) {
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
      setEvents(modifiedData);
    }
  }, [data]);

  if (error) return <p>Failed to load.</p>;
  if (!data && !events) return <p>Loading...</p>;

  function findEventsHandler(year, month) {
    const fullPath = `/events/${year}/${month}`;

    router.push(fullPath);
  }

  return (
    <Fragment>
      <EventsSearch onSearch={findEventsHandler} />
      <EventList items={events} />
    </Fragment>
  );
}

export default AllEventsPage;

export async function getStaticProps() {
  const allEvents = getAllEvents();
  return {
    props: {
      allEvents,
    },
    revalidate: 60,
  };
}
