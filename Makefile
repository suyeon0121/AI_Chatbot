COMPOSE ?= docker compose
FRONTEND_URL ?= http://localhost:5173

.PHONY: start up open down logs ps rebuild

start: up open

up:
	$(COMPOSE) up -d --build

open:
	@sleep 3
	@case "$$(uname -s 2>/dev/null)" in \
		Darwin*) \
			open "$(FRONTEND_URL)" >/dev/null 2>&1 || printf "브라우저에서 %s 를 열어주세요.\n" "$(FRONTEND_URL)" ;; \
		Linux*) \
			xdg-open "$(FRONTEND_URL)" >/dev/null 2>&1 || printf "브라우저에서 %s 를 열어주세요.\n" "$(FRONTEND_URL)" ;; \
		MINGW*|MSYS*|CYGWIN*) \
			cmd.exe /C start "" "$(FRONTEND_URL)" >/dev/null 2>&1 || printf "브라우저에서 %s 를 열어주세요.\n" "$(FRONTEND_URL)" ;; \
		*) \
			printf "브라우저에서 %s 를 열어주세요.\n" "$(FRONTEND_URL)" ;; \
	esac

down:
	$(COMPOSE) down

logs:
	$(COMPOSE) logs -f

ps:
	$(COMPOSE) ps

rebuild:
	$(COMPOSE) up -d --build --force-recreate
