import prisma from '../config/client.js';
export class UserRepository {
    async findByEmail(email) {
        return prisma.user.findUnique({ where: { email } });
    }
    async findById(id) {
        return prisma.user.findUnique({ where: { id } });
    }
    async create(data) {
        return prisma.user.create({ data });
    }
}
