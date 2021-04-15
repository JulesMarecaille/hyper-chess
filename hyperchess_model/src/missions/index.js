import Capture25Pieces from './Capture25Pieces'
import Capture50Pieces from './Capture50Pieces'
import Play10Games from './Play10Games'
import Play5Games from './Play5Games'
import Promote10Pawns from './Promote10Pawns'
import Give25Checks from './Give25Checks'
import Give50Checks from './Give50Checks'

export const MISSION_MAPPING = {
    "Capture25Pieces": Capture25Pieces,
    "Capture50Pieces": Capture50Pieces,
    "Play5Games": Play5Games,
    "Play10Games": Play10Games,
    "Give25Checks": Give25Checks,
    "Give50Checks": Give50Checks,
    "Promote10Pawns": Promote10Pawns,
}
