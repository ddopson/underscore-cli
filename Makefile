

####################################################################################################
## VARIABLES
####################################################################################################

# Variables - Commands
UNDERSCORE      ?= $(shell PATH=./bin:$$PATH which underscore)
ECHO            ?= echo  # MacOS compat: using abs path for 'echo' breaks. Alternatively, this gets fixed when using bash as the shell (vs 'sh')
ECHO_E          ?= $(ECHO) $(shell $(ECHO) -e foo | perl -ne '/^foo/ and print "-e"')

# Variables - Colors
GREEN           ?= \033[32m
YELLOW          ?= \033[38;5;226m
NOCOLOR         ?= \033[39;0m

####################################################################################################
## TARGETS
####################################################################################################

.PHONY: build
build: lint test readme

.PHONY: readme
readme:
	@$(ECHO_E) "$(YELLOW)Generating README.md from README.md.template$(NOCOLOR)"
	$(UNDERSCORE) --data null process '{usage: program.helpInformation()}' | $(UNDERSCORE) template README.md.template > README.md

.PHONY: dist
VERSION = $(shell $(UNDERSCORE) -i package.json extract version --outfmt text)
dist:
	@$(ECHO_E) "$(YELLOW)Packing up tarball$(NOCOLOR)"
	cp -R bin/ lib/ example-data/ Makefile README.md README.md.template package.json index.js package/
	tar -czf underscore-cli-$(VERSION).tgz package/

.PHONY: lint
lint:
	@$(ECHO_E) "$(YELLOW)Running JSHint$(NOCOLOR)"
	jshint bin/underscore lib/*

.PHONY: test
test:
	@$(ECHO_E) "$(YELLOW)Testing Examples...$(NOCOLOR)"
	@bin/underscore examples > expected.txt
	@cat expected.txt | grep -v '#' | grep . | perl -pe 's/underscore/bin\/underscore/' | while read line; do \
			echo "$$line"; \
			bash -c "$$line" | perl -pe 's/^/# /g'; \
			echo; \
		done | perl -pe 's/bin\/underscore/underscore/' > actual.txt
	@diff -ur expected.txt actual.txt
	@$(ECHO_E) "Done."

