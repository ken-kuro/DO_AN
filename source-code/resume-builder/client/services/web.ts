import axios from './axios';

export const fetchTopProfessions = () => axios.get(`/cms/web/top-professions`).then((res) => res.data);
