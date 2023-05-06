"use client";
import { fetchClient, getCourse, getCourses, getHomePage, getReplayOfCourse, getStudentOfCourse } from "@/api";
import CourseDetail from "@/components/Course/Details";
import { WEB_HOST } from "@/constants";
import { GetStaticPaths, GetStaticProps, InferGetStaticPropsType } from "next";
import Head from "next/head";

export const getStaticProps: GetStaticProps = async (context) => {

  const client = await fetchClient();
  const config = await getHomePage();
  const courseId = context.params?.id;

  let res = await getCourse(courseId);
  const courseResult = await getReplayOfCourse(courseId);
  const studentResult = await getStudentOfCourse(courseId);
  res.courseResult = courseResult;
  res.studentResult = studentResult;
  // res = { ...res, introduction: "" } 
  if (!!!res.courseId) {
    return {
      notFound: true,
    }
  }
  return {
    props: {
      data: res,
      client, // will be passed to the page component as props
      config
    },
    revalidate: 10
  };
}

export const getStaticPaths: GetStaticPaths = async () => {
  const res = (await getCourses(false)).courseList;

  const paths = res.map((course) => ({
    params: { id: course.courseId },
  }))

  return { paths, fallback: false }
}


export default function Course(props: InferGetStaticPropsType<typeof getStaticProps>) {
  const { data, client, config } = props;

  const getHeader = () => {
    let { name } = client;
    let { consultUrl, icpInfo } = config;

    let clientInfo = {
      title: client.name,
      logo: consultUrl,
      icpInfo: icpInfo,
      icon: consultUrl,
      webTitle: `${name} - ${data.title} - ${WEB_HOST}`,
      keyWords: `${data.title},${client.clientName},${name}`
    }

    return <>
      <title>{clientInfo.webTitle}</title>
      <meta name="description" content={data.summary || data.title} />
      <meta name="keywords" content={`${clientInfo.keyWords},培训,计算机,科技,技术,edu`} />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <link rel="icon" href={client ? clientInfo.icon : "/logo.png"} />
    </>
  }
  return (
    <>
      <Head>
        {getHeader()}
      </Head>
      <CourseDetail data={data} />
    </>
  );
}