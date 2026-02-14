# Use Bun's official image as base
FROM oven/bun:1 AS base
WORKDIR /app

# Install dependencies into a temp directory
# This will cache them and speed up future builds
FROM base AS install
RUN mkdir -p /temp/dev
COPY package.json bun.lock /temp/dev/
RUN cd /temp/dev && bun install --frozen-lockfile

# Install production dependencies
RUN mkdir -p /temp/prod
COPY package.json bun.lock /temp/prod/
RUN cd /temp/prod && bun install --frozen-lockfile

# Copy node_modules from temp directory
# Then copy all (non-ignored) project files into the image
FROM base AS prerelease
COPY --from=install /temp/dev/node_modules node_modules
COPY . .

# Copy production dependencies and source code into final image
FROM base AS release
COPY --from=install /temp/prod/node_modules node_modules
COPY --from=prerelease /app/index.js .
COPY --from=prerelease /app/package.json .
COPY --from=prerelease /app/src ./src

# Add build arguments for metadata
ARG VERSION
ARG BUILD_DATE
ARG VCS_REF

# Add labels for metadata
LABEL org.opencontainers.image.title="hianime-api"
LABEL org.opencontainers.image.description="A RESTful API for HiAnime content"
LABEL org.opencontainers.image.version="${VERSION}"
LABEL org.opencontainers.image.created="${BUILD_DATE}"
LABEL org.opencontainers.image.revision="${VCS_REF}"
LABEL org.opencontainers.image.source="https://github.com/ryanwtf88/hianime-api"
LABEL org.opencontainers.image.licenses="MIT"

# Expose the port the app runs on
EXPOSE 3030

# Set environment to production
ENV NODE_ENV=production
ENV PORT=3030

# Run the app
USER bun
CMD ["bun", "run", "index.js"]
