import passport from "passport";
import { Strategy as JwtStrategy, ExtractJwt, StrategyOptions } from "passport-jwt";
import { Admin } from "../models/admins.model";
interface JwtPayload {
  id: number;
  usertype: "admin";
  name: string;
  email?: number;
}

const opts: StrategyOptions = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.ANANTRAJ_JWT_SECRET as string,
};

const adminRoles = ["admin", "super_admin"];
const jwtStrategy = new JwtStrategy(opts, async (jwtPayload: JwtPayload, done) => {
  try {
    let user: any = null;
    user = await Admin.findByPk(jwtPayload.id);
    const userData = user ? user.toJSON() : null;
    if (!userData) {
      return done(null, false);
    }
    return done(null, userData);
  } catch (error) {
    return done(error, false);
  }
});

passport.use(jwtStrategy);

export default passport;
