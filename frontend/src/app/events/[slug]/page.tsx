interface Props {
  params: { slug: string };
}

export default function EventDetailPage({ params }: Props) {
  return <main>Event Detail: {params.slug}</main>;
}
