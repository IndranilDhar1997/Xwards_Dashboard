import XPlayRoutes from './routes/xplay';
import XMusicRoutes from './routes/xmusic';
import ProfileRoutes from './routes/profile';
import TeamRoutes from './routes/team';
import BrandRoutes from './routes/brands';
import AuthenticateRoutes from './routes/authenticate';
import CampaignRoutes from './routes/campaign';
import ContentRoutes from './routes/contents';

let exportRoutes = {};

let routingList = [XPlayRoutes, XMusicRoutes, ProfileRoutes, TeamRoutes, BrandRoutes, AuthenticateRoutes, CampaignRoutes, ContentRoutes];

for (let i=0; i<routingList.length; i++) {
    for (let [key, functions] of Object.entries(routingList[i])) {
        exportRoutes[key] = functions;
    }
}

export default exportRoutes;