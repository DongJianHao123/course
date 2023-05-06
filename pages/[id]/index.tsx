"use client";
import { fetchClient, getCourse, getCourses, getHomePage } from "@/api";
import CourseDetail from "@/components/Course/Details";
import { WEB_HOST } from "@/constants";
import { GetStaticPaths, GetStaticProps, InferGetStaticPropsType } from "next";
import Head from "next/head";

export const getStaticProps: GetStaticProps = async (context) => {

  const client = await fetchClient();
  const config = await getHomePage();

  let res = await getCourse(context.params?.id);
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
    let { clientId, name } = client;
    let { consultUrl, icpInfo } = config;

    if (clientId === "466") {
      name = "龙芯直播课堂"
    }

    // let clientInfo;

    // if (client.clientId === "481" || client.clientId === "450") {
    //   clientInfo = {
    //     title: "阿图教育",
    //     logo: "https://ssl.cdn.maodouketang.com/Fi65zYOF9bcEIjo5ZYDrKuosUSiE",
    //     icpInfo: "为中国培养100万信创产业一流人才",
    //     icon: "https://ssl.cdn.maodouketang.com/Fi65zYOF9bcEIjo5ZYDrKuosUSiE",
    //     webTitle: `${name} - ${data.title} - 阿图教育`,
    //     keyWords: `${data.title},${client.clientName},${name},阿图教育,信创`
    //   }
    // } else {
    let clientInfo = {
      title: client.name,
      logo: consultUrl,
      icpInfo: icpInfo,
      icon: consultUrl,
      webTitle: `${name} - ${data.title} - ${WEB_HOST}`,
      keyWords: `${data.title},${client.clientName},${name}`
    }
    // }
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
        {/* {client.clientId === "466" ?
          <>
            <title>{`龙芯直播课堂 - ${data.title} - loongsonedu.cn`}</title>
            <meta name="description" content={data.summary || data.title} />
            <meta name="viewport" content="width=device-width, initial-scale=1" />
            <meta name="keywords" content={`${data.title},${client.clientName},龙芯直播课堂,信创,培训,计算机,科技,技术,edu`} /></>
          :
          client.clientId === "476" ?
            <>
              <title>{`车用操作系统开发培训 - ${data.title} - cicvedu.com`}</title>
              <meta name="description" content={`${data.summary || data.title}}`} />
              <meta name="keywords" content={`${data.title},${client.clientName},车用操作系统开发培训,汽车,操作系统,信创,培训,计算机,科技,技术,edu`} />
            </>
            :
            <>
              <title>{`${client.name} - ${data.title} - 阿图教育`}</title>
              <meta name="description" content={data.summary} />
              <meta name="viewport" content="width=device-width, initial-scale=1" />
              <meta name="keywords" content={`${data.title},${client.name},${client.clientName},阿图教育,信创,培训,计算机,科技,技术,r2,edu`} /></>
        }
        <link rel="icon" href={client ? Utils.client.getInfo(client).icon : "/logo.png"} /> */}
        {getHeader()}
      </Head>
      <CourseDetail data={data} />
    </>
  );
}