import 'slick-carousel/slick/slick-theme.css';
import 'slick-carousel/slick/slick.css';

import { Box } from '@mui/material';
import type { GetStaticProps, NextPage } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useQuery } from 'react-query';

import { AboutUs, CreateCV, ListFeatureJobs, SearchJob, TopProfessions } from '@/components/home';
import Footer from '@/components/shared/Footer';
import Header from '@/components/shared/Header';
import { fetchTopProfessions } from '@/services/web';

import { TOP_PROFESSIONS } from '../constants';

export const getStaticProps: GetStaticProps = async ({ locale = 'vi' }) => ({
  props: {
    ...(await serverSideTranslations(locale, ['common', 'modals', 'landing'])),
  },
});

const Home: NextPage = () => {
  const { data: topProfessions } = useQuery([TOP_PROFESSIONS], () => fetchTopProfessions());

  return (
    <Box>
      <Header />
      <SearchJob />
      <CreateCV />
      <ListFeatureJobs />
      <TopProfessions topProfessions={topProfessions} />
      <AboutUs />
      <Footer />
    </Box>
  );
};

export default Home;
