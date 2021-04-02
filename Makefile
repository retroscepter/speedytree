install:
	deno cache deps.ts
	deno cache tests/*

lint:
	deno lint src/*

test:
	deno test tests/*

test-coverage:
	deno test --coverage=coverage --unstable tests/*
	deno coverage --unstable coverage --lcov > coverage/lcov.info
