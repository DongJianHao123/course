import { useTranslation } from "react-i18next";

const useOptions = () => {
    const { t } = useTranslation()

    const grade = [{
        label: t('register.form.identity_option.freshman'),
        value: "大一"
    }, {
        label: t('register.form.identity_option.sophomore'),
        value: "大二"
    }, {
        label: t('register.form.identity_option.junior'),
        value: "大三"
    }, {
        label: t('register.form.identity_option.senior'),
        value: "大四"
    }, {
        label: t('register.form.identity_option.master'),
        value: "硕士研究生"
    }, {
        label: t('register.form.identity_option.doctor'),
        value: "博士研究生"
    }, {
        label: t('register.form.identity_option.university_teacher'),
        value: "大学老师"
    }, {
        label: t('register.form.identity_option.company_technical_engineer'),
        value: "公司技术工程师"
    }, {
        label: t('register.form.identity_option.other'),
        value: "其他"
    }
    ];

    const hows = [
        { value: t('register.form.source_option.search_engines') },
        { value: t('register.form.source_option.sms_notification') },
        { value: t('register.form.source_option.email_notification') },
        { value: t('register.form.source_option.video_website') },
        { value: t('register.form.source_option.exchange_forum') },
        { value: t('register.form.source_option.friend_recommendation') },
        { value: t('register.form.source_option.advertising_link') },
    ]

    const tags = [
        {
            value: "未订阅通知",
            label: t('register.form.remark_option.unsubscribe_notification')
        },
        {
            value: "已订阅短信通知",
            label: t('register.form.remark_option.subscribe_sms_notification')
        },
        {
            value: "已订阅电话通知",
            label: t('register.form.remark_option.subscribe_phone_notification')
        },
        {
            value: "已订阅全部通知",
            label: t('register.form.remark_option.subscribe_all_notification')
        },
    ];

    const genders = [{
        label: t('register.form.gender_male'),
        value: '男',
    }, {
        label: t('register.form.gender_female'),
        value: '女',
    }]

    return { grade, tags, hows, genders }

}

export default useOptions;