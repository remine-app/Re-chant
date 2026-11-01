import type {DisplayGroup} from '../models/types';
import {spanText} from '../services/runtime';
export default function DisplayGroupRenderer({group,hint}:{group:DisplayGroup;hint:boolean}){return <>{group.rows.map(row=><span className="runtime-row" key={row.id}>{row.spans.map((span,i)=><span key={(span.eventId??row.id)+'-'+i} data-event-id={span.eventId} className={span.chant?(hint&&span.hintKind!=='original'?'chant-mask':'chant'):undefined}>{spanText(span,hint)}</span>)}</span>)}</>}
