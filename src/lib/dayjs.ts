import dayjs from "dayjs"
import ptBr from "dayjs/locale/pt-br"
import utc from "dayjs/plugin/utc"
import timezone from "dayjs/plugin/timezone"
import customParse from "dayjs/plugin/customParseFormat"
import relativeTime from "dayjs/plugin/relativeTime"

const dayjsUtils = dayjs
dayjsUtils.locale(ptBr)
dayjsUtils.extend(utc)
dayjsUtils.extend(timezone)
dayjsUtils.extend(customParse)
dayjsUtils.extend(relativeTime)

export default dayjsUtils
