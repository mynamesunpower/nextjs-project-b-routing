import {
  getAllEvents,
  getEventById,
  getFeaturedEvents,
} from "../../api/api-util";
import EventSummary from "../../components/event-detail/event-summary";
import EventLogistics from "../../components/event-detail/event-logistics";
import EventContent from "../../components/event-detail/event-content";
import ErrorAlert from "../../components/ui/error-alert";
import Head from "next/head";
import Comments from "../../components/input/comments";

function EventDetailPage(props) {
  const event = props.event;

  if (!event) {
    return (
      <div className="center">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>{event.title}</title>
        <meta name="description" content={event.description} />
      </Head>
      <EventSummary title={event.title} />
      <EventLogistics
        date={event.date}
        address={event.location}
        image={event.image}
        imageAlt={event.title}
      />
      <EventContent>
        <p>{event.description}</p>
      </EventContent>
      <Comments events={event.id} />
    </>
  );
}

export default EventDetailPage;

// getStaticProps, getServerSideProps
export async function getStaticProps(context) {
  const eventId = context.params.eventId;
  console.log(`Event ${eventId} Detail Page from StaticProps`);
  const event = await getEventById(eventId);

  return {
    props: {
      event,
    },
    revalidate: 30,
  };
}

export async function getStaticPaths() {
  // const allEvents = await getAllEvents();
  const allEvents = await getFeaturedEvents();

  const paths = allEvents.map((event) => ({ params: { eventId: event.id } }));
  return {
    paths,
    fallback: true, // false -> unknown page => 404
    // true -> existing, but unknown page => update
    // blocking -> ckeksgoqjfla.
  };
}
