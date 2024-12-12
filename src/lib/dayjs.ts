import dayjs from "dayjs"
import ptBr from "dayjs/locale/pt-br"
import utc from "dayjs/plugin/utc"
import timezone from "dayjs/plugin/timezone"
import customParse from "dayjs/plugin/customParseFormat"
const dayjsUtils = dayjs
dayjsUtils.locale(ptBr)
dayjsUtils.extend(utc)
dayjsUtils.extend(timezone)
dayjsUtils.extend(customParse)

export default dayjsUtils
