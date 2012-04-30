

####################################################################################################
## VARIABLES
####################################################################################################

# Variables - Commands
UNDERSCORE      ?= $(shell PATH=./bin:$$PATH which underscore)
ECHO            ?= echo  # MacOS compat: using abs path for 'echo' breaks. Alternatively, this gets fixed when using bash as the shell (vs 'sh')
ECHO_E          ?= $(ECHO) $(shell $(ECHO) -e foo | perl -ne '/^foo/ and print "-e"')
PERL            ?= $(shell which perl)

# Variables - Colors
GREEN           ?= \033[32m
YELLOW          ?= \033[38;5;226m
NOCOLOR         ?= \033[39;0m

####################################################################################################
## TARGETS
####################################################################################################

.PHONY: build
build: lint test readme

.PHONY: readme rme
readme rme:
	@$(ECHO_E) "$(YELLOW)Generating README.md from README.template$(NOCOLOR)"
	$(UNDERSCORE) template -d '{}' README.template > README.md
	@$(ECHO_E) "$(YELLOW)Generating Examples.md$(NOCOLOR)"
	$(UNDERSCORE) examples | $(PERL) -pe '\
		/^underscore (\w+)/ and $$c=$$1; \
		if ($$c ne $$l) { \
			print "</code></pre>\n" if $$l; \
			print "### $$c\n<pre><code>"; \
			$$l=$$c; \
		}; \
		print "</code></pre>\n" if eof' > Examples.md

.PHONY: dist
VERSION = $(shell $(UNDERSCORE) -i package.json extract version --outfmt text)
dist:
	@$(ECHO_E) "$(YELLOW)Packing up tarball$(NOCOLOR)"
	rm -rf ${shell ls -d package/* | grep -v node_modules}
	cp -R bin/ lib/ example-data/ Makefile README.md README.template package.json index.js TODO.md package/
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

.PHONY: bump
bump:
	$(UNDERSCORE) -i package.json process 'vv=data.version.split("."),vv[2]++,data.version=vv.join("."),data' -o package.json
