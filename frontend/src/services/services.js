import dayjs from "dayjs";
require('dayjs/locale/ru')

export const formatViewsCountString = (countOfViews) => {
    const lastNumberOfViewsCount = +countOfViews?.toString().charAt(countOfViews.toString().length - 1);
    return lastNumberOfViewsCount >= 2 && lastNumberOfViewsCount <= 4 && 'a';
}

export const formatExperience = (experience) => {
    return experience> 4 || experience === 0 ? 'лет' : experience === 1 ? 'год' : 'года'
}

export const formatDate = (date) => {
    return dayjs(date).locale('ru').format('DD MMM YYYY')
}