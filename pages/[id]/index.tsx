"use client";
import { fetchClient, getCourse, getCourses, getHomePage, getReplayOfCourse, getStudentOfCourse } from "@/api";
import { Client, HomepageInfo, ICourse } from "@/api/types";
import CourseDetail from "@/components/Course/Details";
import SpecialTopicCourse from "@/components/Course/SpecialTopicCourse";
import { WEB_HOST } from "@/constants";
import { GetStaticPaths, GetStaticProps, InferGetStaticPropsType } from "next";
import Head from "next/head";
import { useEffect, useState } from "react";

export const getStaticPaths: GetStaticPaths = async () => {
  const res = (await getCourses(false)).courseList;

  const paths = res.filter((_course) => _course.gradeLevel).map((course) => ({
    params: { id: course.courseId },
  }))

  return { paths, fallback: true }
}

export const getStaticProps: GetStaticProps<{ data: ICourse, client: Client, config: HomepageInfo }> = async (context) => {

  const client = await fetchClient();
  const config = await getHomePage();
  const courseId = context.params?.id;

  let res = await getCourse(courseId);
  res = { ...res, gradeLevel: res.gradeLevel || 0 }
  const replayList = await getReplayOfCourse(courseId);
  const students = await getStudentOfCourse(courseId);
  res.replayList = replayList;
  res.students = students;
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




export default function Course(props: InferGetStaticPropsType<typeof getStaticProps>) {
  const { data, client, config } = props;

  const getHeader = () => {
    if (!client || !config) return
    let clientInfo = {
      title: client.name,
      logo: config.consultUrl,
      icpInfo: config.icpInfo,
      icon: config.consultUrl,
      webTitle: `${client.name} - ${data.title} - ${WEB_HOST}`,
      keyWords: `${data.title},${client.clientName},${client.name}`
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
      {/* {data && ((data["gradeLevel"] !== undefined && data['gradeLevel'] === 1) ? <SpecialTopicCourse data={data} /> : <CourseDetail data={data} />)} */}
      {data && ((data["gradeLevel"] !== undefined && data['gradeLevel'] === 1) ? <SpecialTopicCourse data={data} /> : <CourseDetail data={data} />)}
    </>
  );
}