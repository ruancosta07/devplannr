import dayjs from "dayjs";
import ptBr from "dayjs/locale/pt-br";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import relativeTime from "dayjs/plugin/relativeTime";

dayjs.locale(ptBr); // Define o idioma para português
dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(relativeTime);

// Define o fuso horário padrão para São Paulo
dayjs.tz.setDefault("America/Sao_Paulo");

export default dayjs;
