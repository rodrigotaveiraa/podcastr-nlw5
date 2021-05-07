import { format, parseISO} from 'date-fns'
import ptBR from 'date-fns/locale/pt-BR'
import { GetStaticProps } from 'next';
import { useRouter } from 'next/router'
import { type } from 'node:os';
import { api } from '../../services/api';
import { convertDurationToTimeString } from '../../utils/convertDurationToTimeString';

type Episode = {
    id: string;
    title: string;
    members: string;
    publishedAt: string;
    thumbnail: string;
    url: string;
    type: string;
    description: string;
    duration: number;
    durationAsString: String;
}

type EpisodeProps = {
    episode: Episode;
}


export default function Episode({ episode } : EpisodeProps ) {
    const router = useRouter();

    return (
        <h1>{router.query.slug}</h1>
    )
} 


export const getStaticProps: GetStaticProps =  async (ctx) => {
    const { slug } = ctx.params

    const  { data } = await api.get(`/episodes/${slug}`)

    const episode = {
        id: data.id,
        title: data.title,
        thumbnail: data.thumbnail,
        members: data.members,
        publishedAt: format(parseISO(data.published_at), 'd MMM yy', { locale: ptBR }),
        duration: Number(data.file.duration),
        durationAsString: convertDurationToTimeString(Number(data.file.duration)),
        description: data.description,
        url: data.file.url,
      }

    return {
        props: {
            episode,
        },
        revalidate: 60 * 60 * 24 // 24 horas
    }
}